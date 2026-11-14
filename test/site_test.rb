# frozen_string_literal: true

require "minitest/autorun"
require "nokogiri"

ROOT = File.expand_path("..", __dir__)
SITE = File.join(ROOT, "_site")

class SiteTest < Minitest::Test
  def read_site(path)
    full = File.join(SITE, path)
    flunk("missing #{path}; run bundle exec jekyll build") unless File.file?(full)
    File.read(full)
  end

  def page(path)
    Nokogiri::HTML(read_site(path))
  end

  def test_cname_stays_on_the_www_host
    assert_equal "www.clickthisnick.com", File.read(File.join(ROOT, "CNAME")).strip
  end

  def test_home_document_is_well_formed_and_named
    home = page("index.html")
    source = read_site("index.html")
    assert_equal "en", home.at("html")["lang"]
    assert_equal 1, source.scan(/<html/i).size
    assert_equal 1, source.scan(/<body/i).size
    refute_match(/<html/i, home.at("#main").inner_html)
    refute_match(/html5shiv|maximum-scale|user-scalable/i, source)
    title = home.at("title").text
    assert_includes title, "Home"
    assert_includes title, "Nick Smith"
    assert_equal "https://www.clickthisnick.com/", home.at('link[rel="canonical"]')["href"]
    assert_equal 1, home.css("h1").size
    assert_includes home.at("#hero-heading").text, "I Know Software. How Can I Help You?"
    %w[release-engineer vulnerability-testing development-experience knowledge-transfer].each do |id|
      assert home.at("##{id}"), "missing ##{id}"
    end
    stylesheets = home.css('link[rel="stylesheet"]').map { |link| link["href"] }
    assert_equal ["/lib/css/bootswatch.css", "/style.min.css"], stylesheets
    assert_includes source, ".white-row h4"
    assert_includes source, ".jumbotron h3"
    assert_includes source, ".site-name a"
  end

  def test_primary_navigation_and_footer_have_names
    home = page("index.html")
    assert_equal "page", home.at("#nav-home")["aria-current"]
    assert_nil home.at("#nav-blog")["aria-current"]
    {
      "#nav-home" => "/",
      "#nav-blog" => "/blog",
      "#nav-projects" => "/projects",
      "#nav-contact" => "/contact"
    }.each do |id, href|
      link = home.at(id)
      assert link, id
      assert_equal href, link["href"]
      refute_empty link.text.strip
    end

    {
      "#footer-email" => "mailto:admin@clickthisnick.com",
      "#footer-github" => "https://github.com/clickthisnick",
      "#footer-linkedin" => "https://www.linkedin.com/in/clickthisnick",
      "#footer-stackoverflow" => "https://stackoverflow.com/users/4178623/clickthisnick",
      "#footer-rss" => "/feed.xml"
    }.each do |id, href|
      link = home.at(id)
      assert link, id
      assert_equal href, link["href"]
      refute_empty link.text.strip
      assert link.at(".visually-hidden"), "#{id} needs visible text for the accessible name"
    end
    assert home.at("a.skip-link")
    assert_equal "", home.at("#site-avatar img")["alt"]
    refute_empty home.at("#site-avatar").text.strip
  end

  def test_section_pages_mark_the_current_link_and_keep_copy
    blog = page("blog/index.html")
    assert_equal "page", blog.at("#nav-blog")["aria-current"]
    assert_includes blog.at("title").text, "Blog"
    more = blog.at("a.read-more")
    assert_includes more.text, "Happy Pi Day"
    assert_includes more["href"], "/2017/03/14/Pi-Day"

    projects = page("projects/index.html")
    assert_equal "page", projects.at("#nav-projects")["aria-current"]
    assert_includes projects.at("#projects-heading").text, "I Create Software Solutions To Solve Real World Problems"
    images = projects.css("#main img")
    assert_equal 6, images.size
    images.each do |image|
      refute_empty image["alt"].to_s.strip
      src = image["src"]
      assert_match %r{\A/resources/projects/}, src
      assert File.file?(File.join(SITE, src)), src
    end

    contact = page("contact/index.html")
    assert_equal "page", contact.at("#nav-contact")["aria-current"]
    assert_equal "mailto:admin@clickthisnick.com", contact.at("#contact-email")["href"]
    assert_includes contact.at("#contact-heading").text, "Contact"
  end

  def test_missing_page_links_home
    missing = page("404.html")
    assert_includes missing.at("title").text, "Page not found"
    assert_equal "/", missing.at("#back-home")["href"]
  end

  def test_feed_uses_the_working_host_and_site_name
    feed = read_site("feed.xml")
    assert_includes feed, "https://www.clickthisnick.com/"
    assert_includes feed, "Nick Smith"
    refute_includes feed, "Your awesome title"
    refute_match(%r{https://clickthisnick\.com/}, feed)
  end

  def test_recruiter_form_submits_known_fields_and_labels_match
    doc = page("recruiters/index.html")
    source = read_site("recruiters/index.html")
    form = doc.at("#recruiter-form")
    assert_equal "post", form["method"].downcase
    assert_equal "hidden_iframe", form["target"]
    assert_includes form["action"], "1FAIpQLScPT_q2aK4LaT4x3jI3LEa40yCvjZXSwWVwPoTdLBTmET0AEA/formResponse"
    assert_equal "submit", doc.at("#recruiter-submit")["type"]
    refute_match(/onclick\s*=\s*["']redirect\(\)/, source)

    {
      "recruiter-email" => "emailAddress",
      "recruiter-name" => "entry.339553748",
      "recruiter-phone" => "entry.77575126",
      "recruiter-company" => "entry.1454004386",
      "recruiter-hours" => "entry.1831281904"
    }.each do |id, name|
      input = doc.at("##{id}")
      assert input, id
      assert_equal name, input["name"]
      refute_nil input.attribute("required")
      label = doc.at("label[for='#{id}']")
      refute_empty label.text.strip
    end

    assert_equal "1", doc.at('input[name="fvv"]')["value"]
    assert_equal "0", doc.at('input[name="pageHistory"]')["value"]
    assert_equal "-3089809077760842973", doc.at('input[name="fbzx"]')["value"]
    status = doc.at("#recruiter-status")
    assert_equal "polite", status["aria-live"]
    assert_equal "status", status["role"]
    assert_includes source, 'addEventListener("submit"'
    assert_includes source, "window.location.assign"
    assert_includes source, "/hyREOVPtbabaoyLOQbqaserONMvsRMlt/"
    refute_includes source, "onclick=\"redirect()\""
  end

  def test_follow_up_page_exposes_resume_and_scheduling
    doc = page("hyREOVPtbabaoyLOQbqaserONMvsRMlt/index.html")
    resume = doc.at("#download-resume")
    assert_includes resume["href"], "/resources/Nicholas.Smith.Resume.pdf"
    assert_includes resume.text, "Download My Resume"
    assert_equal "https://calendly.com/clickthisnick", doc.at("#schedule-call")["href"]
    assert File.file?(File.join(SITE, "resources/Nicholas.Smith.Resume.pdf"))
  end

  def test_agreement_page_names_controls_and_allows_zoom
    source = read_site("foo.html")
    doc = page("foo.html")
    assert doc.at("body")
    assert_includes doc.at("title").text, "Buyer's Broker Non-Exclusive Agreement"
    refute_match(/maximum-scale|user-scalable\s*=\s*["']?0/i, source)
    {
      "fooInput" => "Buyer's name",
      "barInput" => "Buyer's address",
      "foo2Input" => "Buyer",
      "test" => "Agreement length in days",
      "dollarInput" => "Commission amount in dollars",
      "percentInput" => "Commission percent",
      "protectionInput" => "Protection period in days"
    }.each do |id, text|
      label = doc.at("label[for='#{id}']")
      assert label, id
      assert_includes label.text, text
    end
    assert_equal "Agent", doc.at("#agentDropDown")["aria-label"]
    assert_equal "Buyer signature", doc.at("#buyer-signature")["aria-label"]
    assert_equal "Clear", doc.at("#clear-signature").text.strip
    assert_equal "PDF ME", doc.at("#download-pdf").text.strip
    assert_equal "polite", doc.at("#foo-status")["aria-live"]
    refute_match(/onclick=["']signaturePad\.clear\(\)/, source)
    assert_includes source, 'id="clear-signature"'
    assert_includes source, "https://www.clickthisnick.com/foo.html"
  end

  def test_tooling_is_not_published_and_llms_txt_is
    refute File.exist?(File.join(SITE, "styles/package.json"))
    refute File.exist?(File.join(SITE, "styles/style.scss"))
    refute File.exist?(File.join(SITE, "Gemfile.lock"))
    refute File.exist?(File.join(SITE, "lib/js/bootstrap.min.js"))
    refute File.exist?(File.join(SITE, "lib/css/github-ribbon.css"))
    refute File.exist?(File.join(SITE, "README.md"))
    guide = read_site("llms.txt")
    assert_includes guide, "https://www.clickthisnick.com"
    assert_includes guide, "/recruiters/"
    assert_includes guide, "/contact/"
  end

  def test_post_links_back_to_the_blog
    post = page("2017/03/14/Pi-Day.html")
    assert_includes post.at("h1").text, "Happy Pi Day!"
    assert_equal "/blog", post.at("#back-to-blog")["href"]
  end
end
